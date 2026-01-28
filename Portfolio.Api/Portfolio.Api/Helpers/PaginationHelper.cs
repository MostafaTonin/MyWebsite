namespace Portfolio.Api.Helpers;

/// <summary>
/// Helper للـ Pagination
/// </summary>
public class PaginationHelper<T>
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalItems { get; set; }
    public IEnumerable<T> Items { get; set; } = new List<T>();

    public PaginationHelper(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        TotalItems = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        Items = items;
    }

    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;
}
