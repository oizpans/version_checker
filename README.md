# **Version Checker**
**Installation:**

```
npm install git+https://github.com/oizpans/version_checker.git
```

**Usage:**

```
var { checkVersion } = require('version_checker');

checkVersion({
	currentAppVersion: "1.2.0",
	minimumRequiredAppVersion: "2.1.0",
});
```

**Output:**

```
{
	updated: false,
	incompatible: [
		{
			with: 'minimumAllowedAppVersion', changes: 'MAJOR'
		}
	]
}
```

**Testing**

Open the file ```testing.js``` and add a test scenario:

```
story('This should return true is 3.0.0 => 3.8.0', expect(checkVersion({currentAppVersion: "3.0.0", minimumRequiredAppVersion: "3.8.0"}).updated).toReturn(false));
```
 and run the command ```npm start```
