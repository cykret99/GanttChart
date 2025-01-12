package com.gnt.domain.entity;

import lombok.Data;

@Data
public class TAuthEntity {
	private Integer seqId;
	private String loginId;
	private String groupUuid;
	private String role;
	private String createUserId;
	private String createDate;
}
