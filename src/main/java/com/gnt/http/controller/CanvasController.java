package com.gnt.http.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/canvas")
public class CanvasController {
	
	@PostMapping("/dev")
	public String dev() {
		return "dev";
	}

	@GetMapping("/get_dev")
	public String get() {
		return "dev";
	}
	// api.post(res, 'http://localhost/GanttChart/canvas/dev', '', {headers: {'X-CSRF-TOKEN': 'ckrxOhazKE_bk2Ce-FXVxgxynv61L7f7HSrx3aBbHC-Gz6UmF33GCybWGHj2o1SrmXjh9zQRs5zQH4bWJB2SvJhoLE2__8Mf'}})
}
