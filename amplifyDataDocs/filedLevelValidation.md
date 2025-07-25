Field-level validation
You can enable field-level validation in your model schema by chaining a validate function to the field.

Examples
amplify/data/resource.ts
const schema = a.schema({
  Todo: a.model({
    content: a.string().validate(v => 
      v
        .minLength(1, 'Content must be at least 1 character long')
        .maxLength(100, 'Content must be less than 100 characters')
        .matches('^[a-zA-Z0-9\\\\s]+$', 'Content must contain only letters, numbers, and spaces')
    )
  })
  .authorization(allow => [allow.publicApiKey()])
});
Supported validators
String Validators
For string fields:

Validator	Description	Parameters	Example
minLength	Validates that a string field has at least the specified length	• length: The minimum length required
• errorMessage: Optional custom error message	a.string().validate(v => v.minLength(5, 'String must be at least 5 characters'))
maxLength	Validates that a string field does not exceed the specified length	• length: The maximum length allowed
• errorMessage: Optional custom error message	a.string().validate(v => v.maxLength(100, 'String must be at most 100 characters'))
startsWith	Validates that a string field starts with the specified prefix	• prefix: The prefix the string must start with
• errorMessage: Optional custom error message	a.string().validate(v => v.startsWith("prefix-", 'String must start with prefix-'))
endsWith	Validates that a string field ends with the specified suffix	• suffix: The suffix the string must end with
• errorMessage: Optional custom error message	a.string().validate(v => v.endsWith("-suffix", 'String must end with -suffix'))
matches	Validates that a string field matches the specified regex pattern using the Java regex engine. See notes below.	• pattern: The regex pattern the string must match
• errorMessage: Optional custom error message	a.string().validate(v => v.matches("^[a-zA-Z0-9]+$", 'String must match the pattern'))
Note: Our schema transformer uses the Java regex engine under the hood. Because of how TypeScript processes string literals, you must quadruple-escape special regex characters in your schema. In a TypeScript string literal, writing \\\\s produces the string \\s, which is the correct form for the Java regex engine. If you write \\s, it produces \s, which is invalid. Therefore, for the matches validator, ensure you use quadruple-escaping. For example: a.string().validate(v => v.matches("^[a-zA-Z0-9\\\\s]+$", 'Content must contain only letters, numbers, and spaces'))

Numeric Validators
For integer and float fields:

Validator	Description	Parameters	Example
gt	Validates that a numeric field is greater than the specified value	• value: The value the field must be greater than
• errorMessage: Optional custom error message	a.integer().validate(v => v.gt(10, 'Must be greater than 10'))
gte	Validates that a numeric field is greater than or equal to the specified value	• value: The value the field must be greater than or equal to
• errorMessage: Optional custom error message	a.integer().validate(v => v.gte(10, 'Must be at least 10'))
lt	Validates that a numeric field is less than the specified value	• value: The value the field must be less than
• errorMessage: Optional custom error message	a.integer().validate(v => v.lt(10, 'Must be less than 10'))
lte	Validates that a numeric field is less than or equal to the specified value	• value: The value the field must be less than or equal to
• errorMessage: Optional custom error message	a.integer().validate(v => v.lte(10, 'Must be at most 10'))
positive	Validates that a numeric field is positive	• errorMessage: Optional custom error message	a.integer().validate(v => v.positive('Must be positive'))
negative	Validates that a numeric field is negative	• errorMessage: Optional custom error message	a.integer().validate(v => v.negative('Must be negative'))
Note: Currently, we only support validation on non-array fields of type string, integer, and float.