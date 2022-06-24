/**
 * Auto Generated Class
 *
 * Generated On : Fri Jun 24 2022 20:39:55 GMT+0530 (India Standard Time)
 *
 */

// Represents a customer entity
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

	public Customer(
		string phoneNumber,
		string address
	)
	{
		this.PhoneNumber = phoneNumber;
		this._address = address;

	}
}
