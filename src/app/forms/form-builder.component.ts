import { Component, OnInit } from '@angular/core';
import { IFormField, IForm } from './field_template/form-field';
import { FormsService } from './forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'pm-form-builder',
    templateUrl: './form-builder.component.html',
})
export class FormBuilderComponent implements OnInit {
    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _formsService: FormsService) {
    }


    fieldList: IFormField[] = [];
    selectedField: IFormField;
    form: IForm;
    errorMessage: string;

    ngOnInit() {
        const formId: string = this._route.snapshot.paramMap.get('formId').toString();
        this._formsService.getForm(formId).subscribe(
            forms => {
                this.form = forms;
                this.fieldList = forms.fields.sort((a: IFormField, b: IFormField) => a.index < b.index ? -1 : 1);
            },
            error => {
            this.errorMessage = <any>error;
                alert(this.errorMessage);
            });


        // // this.form = this._formsService.getForm(formId);
        // if (this.form === undefined) {
        //     this._router.navigate(['/newform']);
        // }
    }

    onFieldClicked(message: IFormField): void {
        this.selectedField = message;
        this.fieldList[message.index] = message;
    }
    onFieldDeleteClicked(formField: IFormField): void {
        this._formsService.deleteFormField(this.form.id, formField.id).subscribe(
            forms => {
               // this.fieldList = this.fieldList.filter(e => e.index !== formField.index);
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });
    }
    newFieldAdded(message: IFormField[]): void {
        this.fieldList = message;
        this.selectedField = this.fieldList[this.fieldList.length - 1];
    }
    onClick(): void {
        this.selectedField = null;
    }

    onSaveClick(): void {
        this.form.fields = this.fieldList;
        this._formsService.updateForm(this.form).subscribe(
            forms => {
                // do something after save
            },
            error => {
            this.errorMessage = <any>error;
                alert(this.errorMessage);
            });
    }

    onPreviewClick(): void {
        // Preview
    }
}
