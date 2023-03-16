import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, NotAuthGuard } from './auth.guard';
import { HomeComponent } from '../pages/home/home.component';
import { Covid19NewComponent } from '../pages/covid19-new/covid19-new.component';

const appRoutes: Routes = [
	{
		path: '',
		// component: HomeComponent,
		component: Covid19NewComponent,
		data: { title: 'PinDo | Home' },
		//loadChildren: "../pages/home/home.module#HomeModule"
	},
	{
		path: 'home/:reff_code/:email',
		component: HomeComponent,
		data: { title: 'PinDo | Home' },
	},
	{
		path: 'register/:reff_code/:email',
		loadChildren: '../pages/select-type-register/select-type-register.module#SelectTypeRegisterModule',
		data: { title: 'PinDo | Register' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'register',
		loadChildren: '../pages/select-type-register/select-type-register.module#SelectTypeRegisterModule',
		data: { title: 'PinDo | Register' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'register-test',
		loadChildren: '../pages/register/register.module#RegisterModule',
		data: { title: 'PinDo | Register Test' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'login',
		loadChildren: '../pages/login/login.module#LoginModule',
		data: { title: 'PinDo | Login' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'login/:user_email',
		loadChildren: '../pages/login/login.module#LoginModule',
		data: { title: 'PinDo | Login' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'forgot-password',
		loadChildren: '../pages/forgot-password/forgot-password.module#ForgotPasswordModule',
		data: { title: 'PinDo | Forgot Password' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'reset-password/:authtoken',
		loadChildren: '../pages/reset-password/reset-password.module#ResetPasswordModule',
		data: { title: 'PinDo | Reset Password' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'public-pins',
		loadChildren: '../pages/public-pins/public-pins.module#PublicPinsModule',
		data: { title: 'PinDo | Public Pins' },
		// canActivate: [NotAuthGuard]
	},
	{
		path: 'public-pins/:pid',
		loadChildren: '../pages/public-pins/public-pins.module#PublicPinsModule',
		data: { title: 'PinDo | Public Pins' },
		// canActivate: [NotAuthGuard]
	},
	{
		path: 'public-pins/apply-pins/:pin_ID/:user_details',
		loadChildren: '../pages/public-pins/apply-pins/apply-pins.module#ApplyPinsModule',
		data: { title: 'PinDo | Apply Pin' },
		// canActivate: [NotAuthGuard]
	},
	{
		path: 'services',
		loadChildren: '../pages/services/services.module#ServicesModule',
		data: { title: 'PinDo | Find A Doer' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'doer-details/:doer_id',
		loadChildren: '../pages/doer-public-profile/doer-public-profile.module#DoerPublicProfileModule',
		data: { title: 'PinDo | Doer Details' },
	},
	{
		path: 'faq',
		loadChildren: '../pages/faq/faq.module#FaqModule',
		data: { title: 'PinDo | Faq' }
	},
	{
		path: 'pin-listing/:id',
		loadChildren: '../pages/pin-listing/pin-listing.module#PinListingModule',
		data: { title: 'PinDo | Pins' }
	},
	{
		path: 'benefits',
		loadChildren: '../pages/benefits/benefits.module#BenefitsModule',
		data: { title: 'PinDo | Benefits' }
	},
	{
		path: 'how-it-works',
		loadChildren: '../pages/privacy/privacy.module#PrivacyModule',
		data: { title: 'PinDo | Privacy' }
	},
	{
		path: 'covid19help',
		loadChildren: '../pages/covid19/covid19.module#Covid19Module',
		data: { title: 'PinDo | Covid19' }
	},
	// {
	// 	path: 'covid19help',
	// 	loadChildren: '../pages/covid19-new/covid19-new.module#Covid19NewModule',
	// 	data: { title: 'PinDo | Covid19' }
	// },
	{
		path: 'about-us',
		loadChildren: '../pages/privacy/privacy.module#PrivacyModule',
		data: { title: 'PinDo | Privacy' }
	},
	{
		path: 'terms-privacy',
		loadChildren: '../pages/privacy/privacy.module#PrivacyModule',
		data: { title: 'PinDo | Privacy' }
	},
	{
		path: 'press-center',
		loadChildren: '../pages/privacy/privacy.module#PrivacyModule',
		data: { title: 'PinDo | Privacy' }
	},
	{
		path: 'investor-relations',
		loadChildren: '../pages/privacy/privacy.module#PrivacyModule',
		data: { title: 'PinDo | Privacy' }
	},
	{
		path: 'terms',
		loadChildren: '../pages/terms/terms.module#TermsModule',
		data: { title: 'PinDo | Terms' }
	},
	{
		path: 'support',
		loadChildren: '../pages/support/support.module#SupportModule',
		data: { title: 'PinDo | Support' }
	},
	{
		path: 'customerinfo',
		loadChildren: '../pages/cms-info/cms-info.module#CmsInfoModule',
		data: { title: 'PinDo | Customer Info' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'serviceproviderinfo',
		loadChildren: '../pages/cms-info/cms-info.module#CmsInfoModule',
		data: { title: 'PinDo | Service Provider Info' },
		canActivate: [NotAuthGuard]
	},
	{
		path: 'partnerinfo',
		loadChildren: '../pages/cms-info/cms-info.module#CmsInfoModule',
		data: { title: 'PinDo | Partner Info' }
	},
	{
		path: 'notifications',
		loadChildren: '../pages/notifications/notifications.module#NotificationsModule',
		data: { title: 'PinDo | Notifications' },
		canActivate: [AuthGuard]
	},
	// {
	// 	path: 'doer/dashboard',
	// 	loadChildren: '../pages/doer/doerdashboard/doerdashboard.module#DoerdashboardModule',
	// 	data: { title: 'PinDo | DashBoard' },
	// 	canActivate: [AuthGuard],
	// },
	{
		path: 'doer/dashboard',
		loadChildren: '../pages/doer/doer-activity/doer-activity.module#DoerActivityModule',
		data: { title: 'Doer | DashBoard' },
		canActivate: [AuthGuard],
	},
	{
		path: 'pinner/dashboard',
		loadChildren: '../pages/pinner/pinner-activity/pinner-activity.module#PinnerActivityModule',
		data: { title: 'Pinner | DashBoard' },
		canActivate: [AuthGuard],
	},
	{
		path: 'doer/my-pins',
		loadChildren: '../pages/doer/doer-pins/my-pins/my-pins.module#MyPinsModule',
		data: { title: 'PinDo | My Pins' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/chat',
		loadChildren: '../pages/doer/doer-chat/doer-chat.module#DoerChatModule',
		data: { title: 'PinDo | Chat' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/apply-pins/:pin_ID',
		loadChildren: '../pages/doer/doer-pins/apply-pins/apply-pins.module#ApplyPinsModule',
		data: { title: 'PinDo | Quote Details' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/quotation-preview/:slug',
		loadChildren: '../pages/doer/doer-pins/quotation-preview/quotation-preview.module#QuotationPreviewModule',
		data: { title: 'PinDo | Quotation Preview' },
		canActivate: [AuthGuard]
	},
	/*{
        path: 'doer/dashboard', loadChildren: () => new Promise(resolve => {
            (require as any).ensure([], require => {
                resolve(require('../pages/doer/doerdashboard/doerdashboard.module').DoerdashboardModule);
            })
        })
    },*/
	{
		path: 'doer/my-profile',
		loadChildren: 'src/app/pages/doer/doer-profile/doer-profile.module#DoerProfileModule',
		data: { title: 'PinDo | My Profile' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/transactions',
		loadChildren: '../pages/doer/doer-transactions/doer-transactions.module#DoerTransactionsModule',
		data: { title: 'PinDo | Transactions' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/refer-doer/:pin_ID',
		loadChildren: 'src/app/pages/doer/refer-doer/refer-doer.module#ReferDoerModule',
		data: { title: 'PinDo | Refer Doer' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/help-center',
		loadChildren: '../pages/help-center/help-center.module#HelpCenterModule',
		data: { title: 'PinDo | Help Center' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/notifications',
		loadChildren: '../pages/notifications/notifications.module#NotificationsModule',
		data: { title: 'PinDo | Notifications' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/request-advertisement',
		loadChildren: '../pages/doer/request-advertisement/request-advertisement.module#AdvertisementModule',
		data: { title: 'PinDo | Request Advertisement' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/doer-advertisement',
		loadChildren: '../pages/doer/doer-advertisement/doer-advertisement.module#DoerAdvertisementModule',
		data: { title: 'PinDo | Doer Advertisement' },
		canActivate: [AuthGuard]
	},
	// {
	// 	path: 'pinner/dashboard',
	// 	loadChildren: '../pages/pinner/pinnerdashboard/pinnerdashboard.module#PinnerdashboardModule',
	// 	data: { title: 'PinDo | DashBoard' },
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: 'pinner/my-profile',
	// 	loadChildren: '../pages/pinner/pinner-profile/pinner-profile.module#PinnerProfileModule',
	// 	data: { title: 'My Profile' },
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: 'pinner/create-new-pin',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-new-pin/create-new-pin.module#CreateNewPinModule',
	// 	data: { title: 'PinDo | Create New Pin' },
	// 	canActivate: [AuthGuard]
	// },
	// {

	// 	path: 'pinner/edit-pin/:slug',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-new-pin/create-new-pin.module#CreateNewPinModule',
	// 	data: { title: 'PinDo | Edit Pin' },
	// 	canActivate: [AuthGuard]
	// },

	// {
	// 	path: 'pinner/create-new-pin-old',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-new-pin-old/create-new-pin.module#CreateNewPinModule',
	// 	data: { title: 'PinDo | Create New Pin' },
	// 	canActivate: [AuthGuard]
	// },
	// {

	// 	path: 'pinner/edit-pin-old/:slug',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-new-pin-old/create-new-pin.module#CreateNewPinModule',
	// 	data: { title: 'PinDo | Edit Pin' },
	// 	canActivate: [AuthGuard]
	// },

	{
		path: 'pinner/invite-doer/:pin_id',
		loadChildren: '../pages/pinner/pinner-pin/invite-doer/invite-doer.module#InviteDoerModule',
		data: { title: 'PinDo | Invite Doer' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/my-pins',
		loadChildren: '../pages/pinner/pinner-pin/my-pins/my-pins.module#MyPinsModule',
		data: { title: 'PinDo | My Pins' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/active-quotations/:job_id',
		loadChildren: '../pages/pinner/pinner-pin/quotations/quotations.module#QuotationsModule',
		data: { title: 'PinDo | Active Quotations' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/active-quotation-details/:job_id/:doer-id',
		loadChildren: '../pages/pinner/pinner-pin/active-quotation-details/active-quotation-details.module#ActiveQuotationDetailsModule',
		data: { title: 'PinDo | Active Quotation Details' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/payment-settings',
		loadChildren: '../pages/pinner/pinner-payment-settings/pinner-payment-settings.module#PinnerPaymentSettingsModule',
		data: { title: 'PinDo | Payment Settings' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/transactions',
		loadChildren: '../pages/pinner/pinner-transactions/pinner-transactions.module#PinnerTransactionsModule',
		data: { title: 'PinDo | Transactions' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/favourite-doers',
		loadChildren: '../pages/favourite-doers/favourite-doers.module#FavouriteDoersModule',
		data: { title: 'PinDo | Favourites' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/favourite-doers',
		loadChildren: '../pages/favourite-doers/favourite-doers.module#FavouriteDoersModule',
		data: { title: 'PinDo | Favourites' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/chat',
		loadChildren: '../pages/pinner/pinner-chat/pinner-chat.module#PinnerChatModule',
		data: { title: 'PinDo | Chat' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/payment-settings',
		loadChildren: 'src/app/pages/doer/doer-payment-settings/doer-payment-settings.module#DoerPaymentSettingsModule',
		data: { title: 'PinDo | Payment Settings' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/payment-settings-express',
		loadChildren: '../pages/doer/doer-payment-settings-express/doer-payment-settings-express.module#DoerPaymentSettingsExpressModule',
		data: { title: 'PinDo | Payment Express Settings' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/payment-settings-express',
		loadChildren: '../pages/pinner/pinner-payment-settings-express/pinner-payment-settings-express.module#PinnerPaymentSettingsExpressModule',
		data: { title: 'PinDo | Payment Express Settings' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/help-center',
		loadChildren: '../pages/help-center/help-center.module#HelpCenterModule',
		data: { title: 'PinDo | Help Center' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/notifications',
		loadChildren: '../pages/notifications/notifications.module#NotificationsModule',
		data: { title: 'PinDo | Notifications' },
		canActivate: [AuthGuard]
	},
	{
		path: 'impersonate/:token',
		loadChildren: '../pages/impersonate/impersonate.module#ImpersonateModule',
		data: { title: 'PinDo | Impersonate' },
		//canActivate: [AuthGuard]
	},
	{
		path: 'community/community-home',
		loadChildren: '../pages/community/community-home/community-home.module#CommunityHomeModule',
		data: { title: 'PinDo | Community Home' },
		canActivate: [AuthGuard]
	},
	{
		path: 'community/community-contacts',
		loadChildren: '../pages/community/community-contacts/community-contacts.module#CommunityContactsModule',
		data: { title: 'PinDo | Community Contact' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/community-home',
		loadChildren: '../pages/community/doer/community-home/community-home.module#CommunityHomeModule',
		data: { title: 'PinDo | Community Home' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/community-contacts',
		loadChildren: '../pages/community/doer/community-contacts/community-contacts.module#CommunityContactsModule',
		data: { title: 'PinDo | Community Contact' },
		canActivate: [AuthGuard]
	},
	{
		path: 'blog-list',
		loadChildren: '../pages/community/blog-list/blog-list.module#BlogListModule',
		data: { title: 'PinDo | Blog' },
		//canActivate: [AuthGuard]
	},
	{
		path: 'blog-detail/:id',
		loadChildren: '../pages/community/blog-detail/blog-detail.module#BlogDetailModule',
		data: { title: 'PinDo | Blog' },
		//canActivate: [AuthGuard]
	},
	{
		path: 'public/pinner-profile/:id',
		loadChildren: '../pages/pinner/pinner-profile-new/pinner-profile-new.module#PinnerProfileNewModule',
		data: { title: 'PinDo | Pinner Profile' },
		// canActivate: [AuthGuard]
	},
	{
		path: 'doer/doer-profile/:id',
		loadChildren: '../pages/doer/doer-profile-new/doer-profile-new.module#DoerProfileNewModule',
		data: { title: 'PinDo | doer Profile' },
		// canActivate: [AuthGuard]
	},
	{
		path: 'pinner/manage-profile',
		loadChildren: '../pages/pinner/pinner-profile-new/pinner-profile-new.module#PinnerProfileNewModule',
		data: { title: 'PinDo | Manage Profile' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/manage-profile',
		loadChildren: '../pages/doer/doer-profile-new/doer-profile-new.module#DoerProfileNewModule',
		data: { title: 'PinDo | Manage Profile' },
		canActivate: [AuthGuard]
	},
	{
		path: 'pinner/account-settings',
		loadChildren: '../pages/pinner/account-settings/account-settings.module#AccountSettingsModule',
		data: { title: 'PinDo | Pinner Account Settings' },
		canActivate: [AuthGuard]
	},
	{
		path: 'doer/account-settings',
		loadChildren: '../pages/doer/account-settings/account-settings.module#AccountSettingsModule',
		data: { title: 'PinDo | Doer Account Settings' },
		canActivate: [AuthGuard]
	},

	{
		path: 'doer/account-settings/:pid',
		loadChildren: '../pages/doer/account-settings/account-settings.module#AccountSettingsModule',
		data: { title: 'PinDo | Doer Account Settings' },
		canActivate: [AuthGuard]
	},
	// {
	// 	path: 'pinner/create-pin',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-pin_m/create-pin.module#CreatePinModule',
	// 	data: { title: 'PinDo | Create pin' },
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: 'pinner/edit-pin/:slug',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-pin_m/create-pin.module#CreatePinModule',
	// 	data: { title: 'PinDo | Edit pin' },
	// 	canActivate: [AuthGuard]
	// },

	{
		path: 'create-pin', // dummy create pin page
		loadChildren: '../pages/covid19-new/create-pin-dummy/create-pin-dummy.module#CreatePinDummyModule',
		data: { title: 'PinDo | Create pin' },
	},
	{
		path: 'account-settings', // dummy account settings page
		loadChildren: '../pages/covid19-new/account-settings-dummy/account-settings-dummy.module#AccountSettingsDummyModule',
		data: { title: 'PinDo | Doer Account Settings' },
	},

	{
		path: 'pinner/create-new-pin',
		loadChildren: '../pages/pinner/pinner-pin/create-pin/create-pin.module#CreatePinModule',
		data: { title: 'PinDo | Create pin' },
		canActivate: [AuthGuard]
	},

	{
		path: 'pinner/edit-pin/:slug',
		loadChildren: '../pages/pinner/pinner-pin/create-pin/create-pin.module#CreatePinModule',
		data: { title: 'PinDo | Edit pin' },
		canActivate: [AuthGuard]
	},
	// {
	// 	path: 'pinner/create-new-pin',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-pin/create-pin.module#CreatePinModule',
	// 	data: { title: 'PinDo | Create pin' },
	// 	canActivate: [AuthGuard]
	// },

	// {
	// 	path: 'pinner/edit-pin/:slug',
	// 	loadChildren: '../pages/pinner/pinner-pin/create-pin/create-pin.module#CreatePinModule',
	// 	data: { title: 'PinDo | Edit pin' },
	// 	canActivate: [AuthGuard]
	// },
	{
		path: 'invitation/:type/:slug',
		loadChildren: '../pages/invitation/invitation.module#InvitationModule',
		data: { title: '' },
	},
	{
		path: 'crew-membership',
		loadChildren: '../pages/crew-membership/crew-membership.module#CrewMembershipModule',
		data: { title: 'PinDo | Crew Membership' }
	},
	{
		path: 'checkpoint/:id',
		loadChildren: '../pages/checkpoint/checkpoint.module#CheckpointModule',
		data: { title: '' },
	},
	{
		path: 'errors',
		loadChildren: '../pages/error/error.module#Error404Module',
		data: { title: 'PinDo | 404' },
	},
	{
		path: '**',
		redirectTo: 'errors'
	}


]

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);