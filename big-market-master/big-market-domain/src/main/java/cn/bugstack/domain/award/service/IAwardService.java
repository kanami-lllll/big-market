package cn.bugstack.domain.award.service;

import cn.bugstack.domain.award.model.entity.DistributeAwardEntity;
import cn.bugstack.domain.award.model.entity.UserAwardRecordEntity;
import cn.bugstack.domain.award.model.entity.UserAwardRecordQueryEntity;

import java.util.List;

public interface IAwardService {

    void saveUserAwardRecord(UserAwardRecordEntity userAwardRecordEntity);

    List<UserAwardRecordQueryEntity> queryUserAwardRecordList(String userId, Long activityId);

    /**
     * 配送发货奖品
     */
    void distributeAward(DistributeAwardEntity distributeAwardEntity) throws Exception;

}
