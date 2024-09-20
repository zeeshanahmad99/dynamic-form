import { zodResolver } from '@hookform/resolvers/zod'
import { AddCircleRounded, DeleteForeverRounded } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import Container from './Container'
import { formDefaultValues, formSchema, FormSchema } from './formSchema'

function App() {
  const {
    register,
    formState: { errors: notTypedErrors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  })

  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: 'languages',
  })

  const errors: FieldErrors<Extract<FormSchema, { hasWorkExperience: true }>> &
    FieldErrors<Extract<FormSchema, { knowsOtherLanguages: true }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: 'noFormalEducation' }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: 'highSchoolDiploma' }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: 'bachelorsDegree' }>> =
    notTypedErrors

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    alert(JSON.stringify(data, null, 2))
  }

  const hasWorkExperience = useWatch({ control, name: 'hasWorkExperience' })
  const knowsOtherLanguages = useWatch({ control, name: 'knowsOtherLanguages' })
  const educationLevel = useWatch({ control, name: 'educationLevel' })

  useEffect(() => {
    if (knowsOtherLanguages) {
      replace([{ name: '' }])
    }
  }, [knowsOtherLanguages, replace])

  return (
    <Container>
      <TextField
        {...register('fullName')}
        label="Full Name"
        helperText={errors.fullName?.message}
        error={!!errors.fullName}
      />
      <FormControlLabel
        {...register('hasWorkExperience')}
        label="Has Experience"
        control={<Checkbox />}
      />

      {hasWorkExperience && (
        <TextField
          {...register('companyName')}
          label="Company Name"
          helperText={errors.companyName?.message}
          error={!!errors.companyName}
        />
      )}
      <FormControlLabel
        {...register('knowsOtherLanguages')}
        label="Knows Other Languages"
        control={<Checkbox />}
      />

      {knowsOtherLanguages && (
        <>
          {fields.map((field, index) => (
            <div key={field.id}>
              <TextField
                sx={{ width: '100%' }}
                {...register(`languages.${index}.name`)}
                label="Language Name"
                helperText={errors.languages?.[index]?.name?.message}
                error={!!errors.languages?.[index]?.name}
              />
              <IconButton
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                color="error"
              >
                <DeleteForeverRounded />
              </IconButton>
            </div>
          ))}
          <IconButton
            sx={{ width: 'fit-content' }}
            onClick={() => append({ name: '' })}
            color="success"
          >
            <AddCircleRounded />
          </IconButton>
        </>
      )}

      <FormControl>
        <FormLabel>Education Level</FormLabel>
        <Controller
          control={control}
          name="educationLevel"
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel
                value="noFormalEducation"
                control={<Radio />}
                label="No Formal Education"
              />
              <FormControlLabel
                value="highSchoolDiploma"
                control={<Radio />}
                label="High School Diploma"
              />
              <FormControlLabel
                value="bachelorDegree"
                control={<Radio />}
                label="Bachelor Degree"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      {educationLevel === 'highSchoolDiploma' && (
        <TextField
          {...register('schoolName')}
          label="School Name"
          helperText={errors.schoolName?.message}
          error={!!errors.schoolName}
        />
      )}

      {educationLevel === 'bachelorsDegree' && (
        <TextField
          {...register('universityName')}
          label="School Name"
          helperText={errors.universityName?.message}
          error={!!errors.universityName}
        />
      )}

      <Button variant="contained" onClick={() => handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  )
}

export default App
