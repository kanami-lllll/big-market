package cn.bugstack.domain.award.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * 用户中奖记录查询实体。
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAwardRecordQueryEntity {

    private String userId;

    private Long activityId;

    private Long strategyId;

    private String orderId;

    private Integer awardId;

    private String awardTitle;

    private Date awardTime;

    private String awardState;

}
