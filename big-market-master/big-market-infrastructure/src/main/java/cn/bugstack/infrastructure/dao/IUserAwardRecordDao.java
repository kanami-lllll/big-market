package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.UserAwardRecord;
import cn.bugstack.middleware.db.router.annotation.DBRouterStrategy;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
@DBRouterStrategy(splitTable = true)
public interface IUserAwardRecordDao {

    void insert(UserAwardRecord userAwardRecord);

    List<UserAwardRecord> queryUserAwardRecordList(UserAwardRecord userAwardRecordReq);

    int updateAwardRecordCompletedState(UserAwardRecord userAwardRecordReq);

}
