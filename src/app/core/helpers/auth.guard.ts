import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getAuthenticationToken();
        if (currentUser && currentUser.usuario) {         
            const views = await this.authenticationService.getMenuUser();
            // logged in so return true
            if (this.hasPermision(state.url, views)) {                
                return true;
            } else {
                this.router.navigateByUrl('403-forbiden');
                return false;
            }        
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    hasPermision(url, views): boolean {
        if (url == "/" || url == "/403-forbiden") {
            console.log("primero", url)
            return true;
        }
        else if (views.some(s => "/" + s.url.toLowerCase() == url.toLowerCase())) {
            console.log("segundo")
            return true;
        }
        else {
            console.log("tercero")
            return false;
        }
    }
}