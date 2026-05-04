package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.RaffleActivityStage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IRaffleActivityStageDao {

    void insert(RaffleActivityStage raffleActivityStage);

    Integer updateStageActivity2ActiveById(Long id);

    Long queryStageActivity2ActiveById(Long id);

    Long queryStageActiveBySC(RaffleActivityStage raffleActivityStage);

    List<RaffleActivityStage> queryStageActivityList();

}
