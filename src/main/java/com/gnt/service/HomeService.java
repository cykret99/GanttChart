package com.gnt.service;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.gnt.common.constant.Const;
import com.gnt.common.constant.Const.EContanerType;
import com.gnt.common.util.Utils;
import com.gnt.domain.entity.MGroupEntity;
import com.gnt.domain.entity.MLoginUserEntity;
import com.gnt.domain.entity.TFavoritesEntity;
import com.gnt.domain.entity.TTaskBarEntity;
import com.gnt.domain.mapper.MGroupMapper;
import com.gnt.domain.mapper.TFavoritesMapper;
import com.gnt.domain.mapper.TTaskBarMapper;
import com.gnt.http.form.GanttChartForm;
import com.gnt.http.form.HomeForm;
import com.gnt.http.form.MenuForm;

@Service
public class HomeService {
	
	@Autowired
	TTaskBarMapper taskMapper;
	
	@Autowired
	MGroupMapper groupMapper;
	
	@Autowired
	TFavoritesMapper favoMapper;
	
	public HomeForm initHomeForm(MLoginUserEntity user) {
		HomeForm form = new HomeForm();
		// 新しく画面を開いた場合、初期表示データを取得する
		
		// 初期画面はメニュー
		form.setContainsType(EContanerType.MENU.getType());
		form.setViewUuid(EContanerType.MENU.getType());

		// タブはHomeのみ
		HomeForm.TabForm tabForm = new HomeForm.TabForm();
		tabForm.setTabName("Home");
		tabForm.setContainsType(EContanerType.MENU.getType());
		tabForm.setUuid(EContanerType.MENU.getType());
		List<HomeForm.TabForm> tabArray = new ArrayList<HomeForm.TabForm>();
		tabArray.add(tabForm);
		form.setTabArray(tabArray);
		
		// 初期表示
		MenuForm menu = new MenuForm();
		menu.setFavoritesArray(groupMapper.selectByFavorites(user.getLoginId()));
		menu.setGroupArray(groupMapper.selectParentByAuth(user.getLoginId()));
		form.setMenuForm(menu);
		// メニューはfavoをキャンセル
		form.setFavorites("0");
		
		return form;
	}
	
	public void setGroup(HomeForm form, MLoginUserEntity user) throws ParseException{
		GanttChartForm view = new GanttChartForm();
		
		
		List<MGroupEntity> groupArray = groupMapper.selectByParentUuid(form.getViewUuid());
		
		List<TTaskBarEntity> taskArray = new ArrayList<TTaskBarEntity>();
		for(MGroupEntity groupEntity: groupArray) {
			List<TTaskBarEntity> tmpTaskArray = taskMapper.selectByGroupID(groupEntity.getUuid());
			Double progress = 0.0;
			LocalDate minDate = Utils.toDate("9999-12-31");
			LocalDate maxDate = Utils.toDate("1900-01-01");
			
			LocalDate minDateProgress = Utils.toDate("9999-12-31");	// 進捗出力用
			Double minProgress = 0.0;	// 進捗出力用
			boolean compleat = true;
			
			if(CollectionUtils.isEmpty(tmpTaskArray))
				break;
			
			for(TTaskBarEntity task : tmpTaskArray) {
				LocalDate tmpDate ;
				tmpDate = Utils.toDate(task.getPlanPeriodFrom());
				if(minDate.isAfter(tmpDate)) {
					minDate = Utils.toDate(task.getPlanPeriodFrom());
				}
				tmpDate = Utils.toDate(task.getPlanPeriodTo());
				if(maxDate.isBefore(tmpDate)) {
					maxDate = Utils.toDate(task.getPlanPeriodTo());
				}
				
				// 日付の差をとる
				Long difDate = Utils.differenceDays(Utils.toDate(task.getPlanPeriodFrom()), Utils.toDate(task.getPlanPeriodTo()));
				Double tmp = task.getProgress();
				if(tmp < 1.0) {
					compleat = false;
					Double prog = (Double)(difDate*tmp) - (int)(difDate * tmp);
					LocalDate progDate = Utils.addDate(Utils.toDate(task.getPlanPeriodFrom()), (int)(difDate * tmp));
					if(minDateProgress.isAfter( progDate)) {
						if(Utils.compareToDate(minDateProgress,progDate) != 0 || (Utils.compareToDate(minDateProgress, progDate) == 0 && minProgress > prog)) {
							minProgress = prog;
						}
						minDateProgress = progDate;
					}
				}
			}
			
			if(compleat) {
				progress = 1.0;
			}else {
				// タスクが１つでも未完了である場合
				Long difDate = Utils.differenceDays(minDate, maxDate);
				progress = (Utils.differenceDays(minDate, minDateProgress) + minProgress) / (double)difDate;
			}
			
			TTaskBarEntity taskEntity = new TTaskBarEntity();
			taskEntity.setUuid(groupEntity.getUuid());
			taskEntity.setGroupUuid(form.getViewUuid());
			taskEntity.setTaskName(groupEntity.getGroupName());
			taskEntity.setProgress(progress);
			taskEntity.setPlanPeriodFrom(Utils.toString(minDate));
			taskEntity.setPlanPeriodTo(Utils.toString(maxDate));
			taskEntity.setHandleColor("#FFFF00");
			taskEntity.setPlanColor("#00FF00");
			taskEntity.setResultColor("#0000FF");
			taskArray.add(taskEntity);
		}
		
		
		view.setTaskBarArray(taskArray);
		view.setViewFromDate( DateUtils.addDays(new Date(), -45));
		view.setViewToDate(DateUtils.addDays(new Date(), 45));
		
		MGroupEntity groupEntity;
		groupEntity = groupMapper.selectByUuid(form.getViewUuid());
		view.setViewProjectID(groupEntity.getGroupCode());
		form.setGanttchartForm(view);
		
		List<HomeForm.TabForm> tabArray = new ArrayList<HomeForm.TabForm>();
		boolean newTabFlg = true;
		
		if(!CollectionUtils.isEmpty(form.getTabArray())) {
			for(HomeForm.TabForm addTab : form.getTabArray()) {
				tabArray.add(addTab);
				// すでにタブが登録済みである場合、タブを追加しない
				if(StringUtils.equals(groupEntity.getUuid(), addTab.getUuid())) 
					newTabFlg = false;
			}
		}
		
		if(newTabFlg) {
			HomeForm.TabForm tab = new HomeForm.TabForm();
			tab.setContainsType(EContanerType.GROUP.getType());
			tab.setTabName(groupEntity.getGroupCode());
			tab.setUuid(groupEntity.getUuid());
			tabArray.add(tab);
		}
		
		// 不要タグ削除
		if(StringUtils.equals(form.getContainsType(), Const.EContanerType.GROUP.getType())) {
			for(int i=0; i<tabArray.size(); i++) {
				if(StringUtils.equals(tabArray.get(i).getContainsType(), Const.EContanerType.PROJECT.getType())) {
					tabArray.remove(i);
				}
			}
		}
		
		
		// お気に入り判定
		Integer cnt = favoMapper.selectCnt(user.getLoginId(), form.getViewUuid());
		if(cnt > 0)
			form.setFavorites("1");
		else
			form.setFavorites("0");
		
		
		form.setTabArray(tabArray);
	}

	public void setProject(HomeForm form, MLoginUserEntity user) {
		GanttChartForm view = new GanttChartForm();
		view.setTaskBarArray(taskMapper.selectByGroupID(form.getViewUuid()));
		view.setViewFromDate( DateUtils.addDays(new Date(), -45));
		view.setViewToDate(DateUtils.addDays(new Date(), 45));
		
		MGroupEntity groupEntity;
		groupEntity = groupMapper.selectByUuid(form.getViewUuid());
		view.setViewProjectID(groupEntity.getGroupCode());
		form.setGanttchartForm(view);
		
		List<HomeForm.TabForm> tabArray = new ArrayList<HomeForm.TabForm>();
		boolean newTabFlg = true;
		
		if(!CollectionUtils.isEmpty(form.getTabArray())) {
			for(HomeForm.TabForm addTab : form.getTabArray()) {
				tabArray.add(addTab);
				// すでにタブが登録済みである場合、タブを追加しない
				if(StringUtils.equals(groupEntity.getUuid(), addTab.getUuid())) 
					newTabFlg = false;
			}
		}
		
		if(newTabFlg) {
			HomeForm.TabForm tab = new HomeForm.TabForm();
			tab.setContainsType(EContanerType.PROJECT.getType());
			tab.setTabName(groupEntity.getGroupCode());
			tab.setUuid(groupEntity.getUuid());
			tabArray.add(tab);
		}
		
		// お気に入り判定
		Integer cnt = favoMapper.selectCnt(user.getLoginId(), form.getViewUuid());
		if(cnt > 0)
			form.setFavorites("1");
		else
			form.setFavorites("0");
		
		
		form.setTabArray(tabArray);
	}
	
	
	public void updatePlanDate(TTaskBarEntity entity) {
		entity.setPlanPeriodFrom(StringUtils.left(entity.getPlanPeriodFrom(), 10));
		entity.setPlanPeriodTo(StringUtils.left(entity.getPlanPeriodTo(), 10));
		taskMapper.updatePlanDate(entity);
		
	}

	public void updateTaskBar(TTaskBarEntity entity) {
		entity.setPlanPeriodFrom(StringUtils.left(entity.getPlanPeriodFrom(), 10));
		entity.setPlanPeriodTo(StringUtils.left(entity.getPlanPeriodTo(), 10));
		taskMapper.updateTaskBar(entity);
	}

	public void pushFavo(HomeForm form , MLoginUserEntity user) {
		if(StringUtils.equals(form.getFavorites(), "1")) {
			TFavoritesEntity entity = new TFavoritesEntity();
			entity.setLoginId(user.getLoginId());
			entity.setGroupUuid(form.getViewUuid());
			favoMapper.insert(entity);
		}else {
			favoMapper.delete(user.getLoginId(), form.getViewUuid());
		}
	}
	
	
}
