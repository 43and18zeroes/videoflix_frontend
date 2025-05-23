import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

export const authRoutes: Routes = [
  { path: '', component: StartComponent },
  { path: 'sign-up/:token', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'password-reset/:uid/:token', component: PasswordResetComponent },
  { path: '', redirectTo: 'start', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
