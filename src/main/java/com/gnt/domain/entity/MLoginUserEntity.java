package com.gnt.domain.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MLoginUserEntity {
	private Integer seqId;
	private String loginId;
	private String password;
	private String familyName;
	private String firstName;
	private String roles;
	private String deleteFlg;
	private String createUserId;
	private LocalDateTime createDate;
	private String modifyUserId;
	private LocalDateTime modifyDate;
}
