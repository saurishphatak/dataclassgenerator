/**
 * Auto Generated Class
 *
 * Generated On : Thu Jun 23 2022 22:53:10 GMT+0530 (India Standard Time)
 *
 */

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
	public abstract string Address
	{
		[Required]
		get;
	}

	public Customer(
		string customerName,
		string phoneNumber,
		string address
	)
	{
		this.PhoneNumber = phoneNumber;
		this._address = address;

	}
}
