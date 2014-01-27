namespace MvcApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBlogUrl : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.TodoItems");
            DropTable("dbo.TodoLists");
            DropTable("dbo.UserProfile");
            DropForeignKey("dbo.TodoItems", "TodoListId", "dbo.TodoLists");
           
            DropIndex("dbo.TodoItems", new[] { "TodoListId" });
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                        ActiveUntil = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.UserId);
            
            CreateTable(
                "dbo.Downloads",
                c => new
                    {
                        DownloadId = c.Int(nullable: false, identity: true),
                        ActiveUntil = c.DateTime(nullable: false),
                        DownloadUserId_UserId = c.Int(),
                        DownloadProductId_ProductId = c.Int(),
                    })
                .PrimaryKey(t => t.DownloadId)
                .ForeignKey("dbo.UserProfile", t => t.DownloadUserId_UserId)
                .ForeignKey("dbo.Products", t => t.DownloadProductId_ProductId)
                .Index(t => t.DownloadUserId_UserId)
                .Index(t => t.DownloadProductId_ProductId);
            
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        ProductId = c.Int(nullable: false, identity: true),
                        ProductTitle = c.String(),
                        ProductDescription = c.String(),
                        ActiveUntil = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProductId);
            
            DropTable("dbo.TodoItems");
            DropTable("dbo.TodoLists");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TodoLists",
                c => new
                    {
                        TodoListId = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false),
                        Title = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.TodoListId);
            
            CreateTable(
                "dbo.TodoItems",
                c => new
                    {
                        TodoItemId = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                        IsDone = c.Boolean(nullable: false),
                        TodoListId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TodoItemId);
            
            DropIndex("dbo.Downloads", new[] { "DownloadProductId_ProductId" });
            DropIndex("dbo.Downloads", new[] { "DownloadUserId_UserId" });
            DropForeignKey("dbo.Downloads", "DownloadProductId_ProductId", "dbo.Products");
            DropForeignKey("dbo.Downloads", "DownloadUserId_UserId", "dbo.UserProfile");
            DropTable("dbo.Products");
            DropTable("dbo.Downloads");
            DropTable("dbo.UserProfile");
            CreateIndex("dbo.TodoItems", "TodoListId");
            AddForeignKey("dbo.TodoItems", "TodoListId", "dbo.TodoLists", "TodoListId", cascadeDelete: true);
        }
    }
}
