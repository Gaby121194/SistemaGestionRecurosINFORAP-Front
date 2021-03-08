import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html' 
})
export class BlankComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    var url = this.authenticationService.getDefaultView();
    var current = this.route.snapshot;
    if (url != "" && !url.includes("welcome") && !current.url.toString().includes("welcome")) { this.router.navigateByUrl(url); }
  }

}
