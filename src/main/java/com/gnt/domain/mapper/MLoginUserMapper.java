package com.gnt.domain.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.gnt.domain.entity.MLoginUserEntity;

@Mapper
public interface MLoginUserMapper {
	public MLoginUserEntity selectLoginUserByLoginId(String loginId);
}
