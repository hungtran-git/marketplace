pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint256 public orderCount = 0;
    mapping(uint256 => Order) public orders;

    struct Order {
        string hashCode;
        uint256 value;
        bool isWithdraw;
        address buyer;
        string productName;
    }

    event OrderProduct(
        string hashCode,
        uint value,
        bool isWithdraw
    );

    event GetPayment(
        string hashCode,
        uint value,
        bool isWithdraw
    );


    constructor() public {
        name = "Dapp University Marketplace";
    }

    function orderProduct(string memory _hashCode, string memory productName) public payable
    {
        Order memory crtOrder = Order(_hashCode, msg.value, false, msg.sender, productName);
        orders[orderCount++] = crtOrder;

        // trigger an event
        emit OrderProduct(
            crtOrder.hashCode,
            msg.value,
            crtOrder.isWithdraw            
        );
    }

    function getPayment(string memory _hashCode) public payable {
        Order memory selectedOrder;
        uint256 orderIdx;
        bool isExistedOrder = false;
        uint256 count = 0;

        for (uint256 i = 0; i < orderCount; ++i) {
            count++;
            if (keccak256(bytes(orders[i].hashCode)) == keccak256(bytes(_hashCode))) {
                isExistedOrder = true;
                selectedOrder = orders[i];
                orderIdx = i;
            }
        }

        // Require that the order exist
        require(isExistedOrder);
        // Require that the order exist
        require(!selectedOrder.isWithdraw);
        // pay the seller by sending them Ether
        address(msg.sender).transfer(selectedOrder.value);
        selectedOrder.isWithdraw = true;
        orders[orderIdx] = selectedOrder;
        emit GetPayment(
            selectedOrder.hashCode,
            selectedOrder.value,
            selectedOrder.isWithdraw
        );
    }
}
