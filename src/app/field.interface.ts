export interface Validator {
	name: string;
	validator: any;
	message: string;
}
export interface FieldConfig {
	label?: string;
	name?: string;
	inputType?: string;
	values?: string[];
	selectedvalue?: string;
	collections?: any;
	type: string;
	value?: any;
	validations?: Validator[];
}