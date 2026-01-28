using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Entities;

namespace Portfolio.Api.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<AboutSection> AboutSections { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectImage> ProjectImages { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<BlogCategory> BlogCategories { get; set; }
    public DbSet<BlogComment> BlogComments { get; set; }
    public DbSet<BlogPostLike> PostLikes { get; set; }
    public DbSet<BlogCommentLike> CommentLikes { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<SocialLink> SocialLinks { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<SiteSection> SiteSections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Query Filters (Soft Delete)
        modelBuilder.Entity<BlogPost>().HasQueryFilter(p => !p.IsDeleted);
        modelBuilder.Entity<BlogComment>().HasQueryFilter(c => !c.IsDeleted);

        // Blog Relationship Configurations
        modelBuilder.Entity<BlogPost>()
            .HasOne(bp => bp.Category)
            .WithMany(bc => bc.Posts)
            .HasForeignKey(bp => bp.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BlogPost>()
            .HasOne(bp => bp.Author)
            .WithMany(u => u.Posts)
            .HasForeignKey(bp => bp.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<BlogPostLike>()
            .HasOne(l => l.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BlogPostLike>()
            .HasOne(l => l.User)
            .WithMany(u => u.PostLikes)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BlogComment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BlogComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<BlogCommentLike>()
            .HasOne(l => l.Comment)
            .WithMany(c => c.Likes)
            .HasForeignKey(l => l.CommentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BlogCommentLike>()
            .HasOne(l => l.User)
            .WithMany(u => u.CommentLikes)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Project Images
        modelBuilder.Entity<ProjectImage>()
            .HasOne(pi => pi.Project)
            .WithMany(p => p.Images)
            .HasForeignKey(pi => pi.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes for Optimization
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<BlogPost>()
            .HasIndex(bp => bp.Slug)
            .IsUnique();

        modelBuilder.Entity<BlogPost>()
            .HasIndex(bp => bp.CategoryId);

        modelBuilder.Entity<BlogPost>()
            .HasIndex(bp => bp.PublishedDate);

        modelBuilder.Entity<BlogComment>()
            .HasIndex(c => c.PostId);

        modelBuilder.Entity<BlogComment>()
            .HasIndex(c => c.UserId);

        modelBuilder.Entity<BlogComment>()
            .HasIndex(c => c.ParentCommentId);

        modelBuilder.Entity<BlogPostLike>()
            .HasIndex(l => new { l.PostId, l.UserId })
            .IsUnique();

        modelBuilder.Entity<BlogCommentLike>()
            .HasIndex(l => new { l.CommentId, l.UserId })
            .IsUnique();

        modelBuilder.Entity<ContactMessage>()
            .HasIndex(cm => cm.SentDate);
            
        modelBuilder.Entity<AuditLog>()
            .HasIndex(al => al.CreatedAt);
    }
}
