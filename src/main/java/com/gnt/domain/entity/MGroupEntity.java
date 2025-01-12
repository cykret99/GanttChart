package com.gnt.domain.entity;

import lombok.Data;

@Data
public class MGroupEntity {
	private Integer seqId;
	private String uuid;
	private String parentUuid;
	private String level;
	private String groupCode;
	private String groupName;
	private String deleteFlg;
	private String createUserId;
	private String createDate;
	private String modifyUserId;
	private String modifyDate;
	
	private String contenarType;
}
