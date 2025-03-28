import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './auth/site-info/privacy-policy/privacy-policy.component';
import { ImprintComponent } from './auth/site-info/imprint/imprint.component';
import { ConfirmEmailComponent } from './auth/mails/confirm-email/confirm-email.component';

export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'confirm-email-edit', component: ConfirmEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }