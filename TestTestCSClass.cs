public abstract class CustomerAbstract
{
	[Required]
	public string customerName;

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

}	