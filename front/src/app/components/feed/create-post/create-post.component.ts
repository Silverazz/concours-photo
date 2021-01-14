import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxFileDropEntry, FileSystemFileEntry} from 'ngx-file-drop';
import {ToastrService} from 'ngx-toastr';

import {PostsService} from '../../../services/posts.service';
import {Post} from '../../../models/Post.model';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../models/User.model';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
    form: FormGroup;
    files: NgxFileDropEntry[] = [];
    imagePreview: string | ArrayBuffer = null;
    currentFile: NgxFileDropEntry;

    user: User = null;
    userSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<CreatePostComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private toastr: ToastrService,
        private postService: PostsService,
        private authService: AuthService
    ) {
    }

    public dropped(files: NgxFileDropEntry[]): void {
        this.files = files;

        // Only one file required on create post
        if (this.files.length > 1) {
            this.files.pop();
        }

        const droppedFile = files[0];
        // Is it a file ?
        if (droppedFile.fileEntry.isFile && this.isFileAllowed(droppedFile.fileEntry.name)) {
            this.toastr.success('File successfully dropped.');

            this.currentFile = droppedFile;

            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            const reader = new FileReader();
            fileEntry.file((file: File) => {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.imagePreview = reader.result;
                };

                // Access the real file
                console.log(droppedFile.relativePath, file);
            });
        } else {
            this.toastr.error('Only files in ".jpg", ".jpeg", ".png" format are accepted and directories are not allowed.');
            this.imagePreview = null;
            this.files.pop();
        }
    }

    public fileOver(event): void {
        console.log(event);
    }

    public fileLeave(event): void {
        console.log(event);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required]
        });

        this.userSubscription = this.authService.me.subscribe(
            user => this.user = user
        );
        this.authService.emitMe();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

    save(): void {
        console.log('Save method : ');
        if (this.files.length === 1) {
            const fileEntry = this.currentFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                const formData = new FormData();
                const post = new Post(
                    null,
                    null,
                    null,
                    this.user,
                    null,
                    null,
                    null,
                    null
                );

                console.log('Sending post : ' + JSON.stringify(post));

                formData.append('file', file, this.currentFile.relativePath);
                formData.append('post', JSON.stringify(post));

                this.postService.sendPost(
                    formData
                ).subscribe(
                    postSent => {
                        console.log('Receive post -> ' + postSent);
                        this.toastr.success('You posted your picture !');
                    },
                    error => {
                        console.log('Error while sending file -> ' + error);
                        this.toastr.error(error.message);
                    }
                );
            });
        }

        this.dialogRef.close(this.form.value);
    }

    close(): void {
        this.dialogRef.close();
    }

    isFileAllowed(fileName: string): boolean {
        let isFileAllowed = false;
        const allowedFiles = ['.jpg', '.jpeg', '.png'];
        const regex = /(?:\.([^.]+))?$/;
        const extension = regex.exec(fileName);
        if (extension !== undefined && extension !== null) {
            for (const ext of allowedFiles) {
                if (ext === extension[0].toLowerCase()) {
                    isFileAllowed = true;
                }
            }
        }
        return isFileAllowed;
    }

    isFileSelected(): boolean {
        return this.imagePreview !== null;
    }
}
