package com.gnt.http.form;

import java.util.ArrayList;
import java.util.List;

import com.gnt.domain.entity.MGroupEntity;

import lombok.Data;

@Data
public class MenuForm {
    public List<MGroupEntity> favoritesArray;
    public List<MGroupEntity> groupArray;
	
    public MenuForm() {
    	this.favoritesArray = new ArrayList<MGroupEntity>();
    	this.groupArray = new ArrayList<MGroupEntity>();
    }
}
