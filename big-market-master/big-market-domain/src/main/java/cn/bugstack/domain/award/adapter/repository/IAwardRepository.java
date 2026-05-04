package cn.bugstack.domain.award.adapter.repository;

import cn.bugstack.domain.award.model.aggregate.GiveOutPrizesAggregate;
import cn.bugstack.domain.award.model.aggregate.UserAwardRecordAggregate;
import cn.bugstack.domain.award.model.entity.UserAwardRecordQueryEntity;

import java.util.List;

public interface IAwardRepository {

    void saveUserAwardRecord(UserAwardRecordAggregate userAwardRecordAggregate);

    List<UserAwardRecordQueryEntity> queryUserAwardRecordList(String userId, Long activityId);

    String queryAwardConfig(Integer awardId);

    void saveGiveOutPrizesAggregate(GiveOutPrizesAggregate giveOutPrizesAggregate);

    String queryAwardKey(Integer awardId);

}
