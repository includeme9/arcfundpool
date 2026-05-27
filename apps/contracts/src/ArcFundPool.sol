// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ArcFundPool {
    struct Pool {
        address creator;
        string title;
        string metadataURI;
        uint256 targetAmount;
        uint256 totalRaised;
        uint256 deadline;
        bool withdrawn;
        bool cancelled;
    }

    IERC20 public immutable usdc;
    uint256 public nextPoolId;

    mapping(uint256 poolId => Pool) public pools;
    mapping(uint256 poolId => mapping(address contributor => uint256 amount)) public contributions;

    event PoolCreated(uint256 indexed poolId, address indexed creator, string title, string metadataURI, uint256 targetAmount, uint256 deadline);
    event Contributed(uint256 indexed poolId, address indexed contributor, uint256 amount);
    event Withdrawn(uint256 indexed poolId, address indexed creator, uint256 amount);
    event Refunded(uint256 indexed poolId, address indexed contributor, uint256 amount);
    event PoolCancelled(uint256 indexed poolId, address indexed creator);

    error InvalidAmount();
    error InvalidDeadline();
    error PoolNotFound();
    error NotCreator();
    error PoolInactive();
    error TargetNotReached();
    error RefundUnavailable();
    error NothingToRefund();
    error TransferFailed();

    constructor(address usdcAddress) {
        require(usdcAddress != address(0), "USDC address required");
        usdc = IERC20(usdcAddress);
    }

    function poolCount() external view returns (uint256) {
        return nextPoolId;
    }

    function createPool(
        string calldata title,
        string calldata metadataURI,
        uint256 targetAmount,
        uint256 deadline
    ) external returns (uint256 poolId) {
        if (targetAmount == 0) revert InvalidAmount();
        if (deadline <= block.timestamp) revert InvalidDeadline();

        poolId = nextPoolId++;
        pools[poolId] = Pool({
            creator: msg.sender,
            title: title,
            metadataURI: metadataURI,
            targetAmount: targetAmount,
            totalRaised: 0,
            deadline: deadline,
            withdrawn: false,
            cancelled: false
        });

        emit PoolCreated(poolId, msg.sender, title, metadataURI, targetAmount, deadline);
    }

    function contribute(uint256 poolId, uint256 amount) external {
        Pool storage pool = _pool(poolId);
        if (amount == 0) revert InvalidAmount();
        if (!_canReceiveContributions(pool)) revert PoolInactive();

        pool.totalRaised += amount;
        contributions[poolId][msg.sender] += amount;

        if (!usdc.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        emit Contributed(poolId, msg.sender, amount);
    }

    function withdraw(uint256 poolId) external {
        Pool storage pool = _pool(poolId);
        if (msg.sender != pool.creator) revert NotCreator();
        if (pool.withdrawn || pool.cancelled) revert PoolInactive();
        if (pool.totalRaised < pool.targetAmount) revert TargetNotReached();

        pool.withdrawn = true;
        uint256 amount = pool.totalRaised;

        if (!usdc.transfer(pool.creator, amount)) revert TransferFailed();

        emit Withdrawn(poolId, pool.creator, amount);
    }

    function refund(uint256 poolId) external {
        Pool storage pool = _pool(poolId);
        if (!_canRefund(pool)) revert RefundUnavailable();

        uint256 amount = contributions[poolId][msg.sender];
        if (amount == 0) revert NothingToRefund();

        contributions[poolId][msg.sender] = 0;
        pool.totalRaised -= amount;

        if (!usdc.transfer(msg.sender, amount)) revert TransferFailed();

        emit Refunded(poolId, msg.sender, amount);
    }

    function cancelPool(uint256 poolId) external {
        Pool storage pool = _pool(poolId);
        if (msg.sender != pool.creator) revert NotCreator();
        if (pool.withdrawn || pool.cancelled || block.timestamp >= pool.deadline) revert PoolInactive();

        pool.cancelled = true;

        emit PoolCancelled(poolId, msg.sender);
    }

    function _pool(uint256 poolId) internal view returns (Pool storage pool) {
        if (poolId >= nextPoolId) revert PoolNotFound();
        return pools[poolId];
    }

    function _canReceiveContributions(Pool storage pool) internal view returns (bool) {
        return !pool.withdrawn && !pool.cancelled && block.timestamp < pool.deadline;
    }

    function _canRefund(Pool storage pool) internal view returns (bool) {
        if (pool.withdrawn) return false;
        if (pool.cancelled) return true;
        return block.timestamp > pool.deadline && pool.totalRaised < pool.targetAmount;
    }
}
