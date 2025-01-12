package com.gnt.domain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gnt.domain.entity.TTaskBarEntity;

@Mapper
public interface TTaskBarMapper {
	public List<TTaskBarEntity> selectByGroupID(String groupID);
	public Integer updatePlanDate(TTaskBarEntity entity);
	public Integer updateTaskBar(TTaskBarEntity entity);
}
