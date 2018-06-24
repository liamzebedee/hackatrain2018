pragma solidity ^0.4.21;


// library x {
//   struct Location {
//     string addr;
//     string latitude;
//     string longitude;
//   }
// }


// import "./TransportOffer.sol";
// import  "./TransportRequest.sol";

contract TransportOffer {
  uint public minPeople;
  uint public maxCapacity;
  uint public datetime;
  string public from;
  string public to;
  uint public fee;

  function TransportOffer
  (uint _minPeople, uint _maxCapacity, uint _datetime, string _from, string _to, uint _fee) {
    require(_maxCapacity > 0);
    require(_datetime > now);

    minPeople = _minPeople;
    maxCapacity = _maxCapacity;
    datetime = _datetime;
    from = _from;
    to = _to;
    fee = _fee;
  }
}

contract TransportRequest {
  uint public datetime;
  uint public maxAmount;
  string  public from;
  string public to;
  address public by;
  TransportOffer public fulfilledBy;

  enum State { UNFUNDED, OPEN, CANCELLED, FULFILLED }
  State public state;

  modifier isOwner() {
    require(msg.sender == by);
    _;
  }

  function TransportRequest(
    uint _datetime,
    string _from,
    string _to
  ) public 
  {
    datetime = _datetime;
    from = _from;
    to = _to;
    state = State.UNFUNDED;
  }

  function deposit(address _by) public payable {
    // require(msg.value > 0);
    // require(address(this).balance == 0);
    // require(state == State.UNFUNDED);
    by = _by;
    maxAmount = msg.value;
    state = State.OPEN;
  }

  function commit(TransportOffer offer) isOwner {
    require(state == State.OPEN);
    fulfilledBy = offer;
    state = State.FULFILLED;
  }

  function cancel() public isOwner {
    require(state == State.OPEN);
    require(msg.sender == by);
    by.transfer(address(this).balance);
    state = State.CANCELLED;
  }
}

contract TransportMarket {
  event NewOffer(TransportOffer offer);
  event NewRequest(TransportRequest request);

  function TransportMarket() public {
    owner = msg.sender;
  }   

  mapping (uint => TransportRequest) public requests;
  mapping (uint => TransportRequest) public offers;

  address public owner;

  uint private id = 0; 

  function makeRequest(string from, string to) public payable returns (TransportRequest) {
    id += 1;

    TransportRequest req = new TransportRequest(
      now,
      from,
      to
    );
    req.deposit.value(msg.value)(msg.sender);

    requests[id] = req;

    emit NewRequest(req);
    return req;
  }

  function makeOffer(uint minPeople, uint maxCapacity, uint datetime, string from, string to, uint fee) returns (TransportOffer) {
    TransportOffer offer = new TransportOffer(
      minPeople,
      maxCapacity,
      datetime,
      from,
      to,
      fee
    );

    emit NewOffer(offer);
    return offer;
  }

  function commit(TransportRequest req, TransportOffer offer) {
    return req.commit(offer);
  }
}
