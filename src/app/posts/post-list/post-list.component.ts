import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  @Input() posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private postSub: Subscription;

  constructor(public postsService: PostService, private authService: AuthService) {}



  onChangePage(pageData: PageEvent) {
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    });
  }

   ngOnInit() {
     this.postsService.getPosts(this.postsPerPage, this.currentPage);
     this.userId = this.authService.getUserId();
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.totalPosts = postsData.postCount;
        this.posts = postsData.posts;

      });
      this.userIsAuthenticated = this.authService.getIsAuth();
            this.authListenerSubs = this.authService.getAuthStatusListener()
  .subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();
  });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
