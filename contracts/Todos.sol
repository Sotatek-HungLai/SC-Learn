// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {OwnableAndPayable} from "./OwnableAndPayable.sol";

contract Todos is OwnableAndPayable {
    event NewRegister(address userAddr);

    error Unauthorized(address userAddr, string message);
    error UserExist(address userAddr);

    enum Status {
        Pending,
        Completed
    }

    struct Todo {
        string text;
        Status status;
        uint createdAt;
    }

    mapping(address => Todo[]) internal userTodoList;
    mapping(address => bool) internal userExist;

    constructor() OwnableAndPayable(msg.sender) {}

    modifier onlyUser() {
        if (userExist[msg.sender] == false) {
            revert Unauthorized(msg.sender, "You are not authorized");
        }
        _;
    }

    function addUser(address _user) external onlyOnwer {
        if (checkExist(_user)) {
            revert UserExist(_user);
        }
        userExist[_user] = true;
    }

    function register() external payable {
        require(
            msg.value >= 0.1 ether,
            "You need to pay 0.1 ether to register"
        );
        if (msg.value > 0.1 ether) {
            (bool isTransferred, ) = payable(msg.sender).call{
                value: msg.value - 0.1 ether
            }("");
            require(isTransferred, "Transfer back failed");
        }
        if (userExist[msg.sender] == true) {
            revert UserExist(msg.sender);
        }
        userExist[msg.sender] = true;
        emit NewRegister(msg.sender);
    }

    function get(uint _index) public view onlyUser returns (Todo memory) {
        require(
            0 <= _index && _index < userTodoList[msg.sender].length,
            "Index out of bounds"
        );
        return userTodoList[msg.sender][_index];
    }

    function getAll() public view onlyUser returns (Todo[] memory) {
        return userTodoList[msg.sender];
    }

    function create(
        string calldata _text
    ) public onlyUser returns (Todo memory) {
        Todo memory todo;
        todo.text = _text;
        todo.status = Status.Pending;
        todo.createdAt = block.timestamp;
        userTodoList[msg.sender].push(todo);
        return todo;
    }

    function updateText(
        uint _index,
        string calldata _text
    ) public onlyUser returns (Todo memory) {
        require(
            0 <= _index && _index < userTodoList[msg.sender].length,
            "Index out of bounds"
        );
        Todo storage todo = userTodoList[msg.sender][_index];
        todo.text = _text;
        return todo;
    }

    function toggleCompleted(
        uint _index
    ) public onlyUser returns (Todo memory) {
        Todo storage todo = userTodoList[msg.sender][_index];
        todo.status = todo.status == Status.Pending
            ? Status.Completed
            : Status.Pending;
        return todo;
    }

    function transferToOwner() external payable returns (bool) {
        (bool isTransferred, ) = onwer.call{value: address(this).balance}("");
        require(isTransferred, "Transfer failed");
        return isTransferred;
    }

    function getBalance() external view onlyOnwer returns (uint) {
        return address(this).balance;
    }

    function checkExist(address _user) public view onlyOnwer returns (bool) {
        return userExist[_user];
    }
}
