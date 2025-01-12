package com.gnt.domain.entity;

import java.util.List;

import lombok.Data;

@Data
public class TTaskBarEntity {
	private Integer seqId;
	private String uuid;
	private String groupUuid;
	private String taskName;
	private Double progress;
	private String planPeriodFrom;
	private String planPeriodTo;
	private String memo;
	private String handleColor;
	private String planColor;
	private String resultColor;
	private String deleteFlg;
	private String createUserId;
	private String createDate;
	private String modifyUserId;
	private String modifyDate;
	
	private List<MLoginUserEntity> responsiblePerson;
}
