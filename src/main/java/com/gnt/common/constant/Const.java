package com.gnt.common.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class Const {
	
	@AllArgsConstructor
	@Getter
	public enum EInputID {
		BRIDGE_BOX("bridgeBox"),
		;
		
		private final String id;
	}
	
	@AllArgsConstructor
	@Getter
	public enum EContanerType {
		MENU("MENU"),
		GROUP("GROUP"),
		PROJECT("PROJECT"),
		;
		
		private final String type;
	}

}
