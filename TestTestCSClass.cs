namespace CustomerAPI.Models
{
[Required]
public abstract class CustomerAbstract
{
	// Customer phone number
	private string _phoneNumber;
	private virtual string PhoneNumber
	{
		[Required]
		set => _phoneNumber = value;
	}

	protected string _address;
	protected abstract string Address
	{
		[Required]
		get;
	}

	public string customerName;

	public Customer(
		string phoneNumber,
		string address,
		string customerName
	)
	{
		this.PhoneNumber = phoneNumber;
		this._address = address;
		this.customerName = customerName;

}
}
}
