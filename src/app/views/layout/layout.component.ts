import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
  
})
export class LayoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router:Router) { }

  ngOnInit(): void {    
      // var url = this.authenticationService.getDefaultView();
      // this.router.navigateByUrl(url);
    }
}
