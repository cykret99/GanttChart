package com.gnt.domain.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gnt.domain.entity.TFavoritesEntity;

@Mapper
public interface TFavoritesMapper {
	public TFavoritesEntity select( @Param("loginID")String loginID, @Param("uuid")String uuid);
	public Integer selectCnt( @Param("loginID")String loginID, @Param("uuid")String uuid);

	public Integer insert( TFavoritesEntity entity);
	public Integer delete( @Param("loginID")String loginID, @Param("uuid")String uuid);

}
