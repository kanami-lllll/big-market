package cn.bugstack.trigger.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户中奖记录查询响应。
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAwardRecordResponseDTO implements Serializable {

    private String orderId;

    private Integer awardId;

    private String awardTitle;

    private Date awardTime;

    private String awardState;

}
