package com.gnt.domain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gnt.domain.entity.MGroupEntity;

@Mapper
public interface MGroupMapper {
	public List<MGroupEntity> selectByAuth(String loginID);
	public List<MGroupEntity> selectParentByAuth(String loginID);
	public List<MGroupEntity> selectByFavorites(String loginID);
	public MGroupEntity selectByUuid(String uuid);
	public List<MGroupEntity> selectByParentUuid(String uuid);
}
