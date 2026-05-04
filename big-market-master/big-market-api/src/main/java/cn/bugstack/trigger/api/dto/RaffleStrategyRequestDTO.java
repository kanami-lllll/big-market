package cn.bugstack.trigger.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class RaffleStrategyRequestDTO implements Serializable {

    // 抽奖策略ID
    private Long strategyId;

}
