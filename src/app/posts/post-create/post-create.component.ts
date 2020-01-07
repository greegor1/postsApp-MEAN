import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param: ParamMap) => {
        if (param.has('postId')) {
            this.mode = 'edit';
            this.postId = param.get('postId');
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = {id: postData._id, title: postData.title, content: postData.content}
            });  //this http req needs some time so it might throw error of undefinds. Can be fixed by using elvis operator (adding ? in template [ngModel] to force angular to check wether post exists before it)
        } else {
            this.mode = 'create';
            this.postId = null
        }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content)
    }
    form.resetForm();
  }
}
