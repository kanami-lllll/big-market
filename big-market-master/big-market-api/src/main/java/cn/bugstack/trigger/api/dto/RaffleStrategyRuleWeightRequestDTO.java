package cn.bugstack.trigger.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class RaffleStrategyRuleWeightRequestDTO implements Serializable {

    // 用户ID
    private String userId;
    // 抽奖活动ID
    private Long activityId;

}
