import TextField from '@material-ui/core/TextField'

export default () => (
  <TextField
    id="standard-name"
    label="Name"
    className={classes.textField}
    value={values.name}
    onChange={handleChange('name')}
    margin="normal"
  />
)
