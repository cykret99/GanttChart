package com.gnt.domain.entity;

import lombok.Data;

@Data
public class TFavoritesEntity {
	private Integer seqId;
	private String loginId;
	private String groupUuid;
	private String createUserId;
	private String createDate;	
}
