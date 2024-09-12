import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid2 } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { useForm } from "react-hook-form";
interface Contato {
    name: string;
    number: string;
    email: string;
    cpf: string;
    birthdayDate: string;
    firstName: string;
    lastName: string;
    businessName: string;
}
export const ContatoModal: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Contato>();
    const contactId = true

    return (
        <Dialog open={true}>
            <DialogTitle>  {contactId ? 'Editar Contato' : 'Adicionar Contato'}</DialogTitle>
            <DialogContent>
                <div className="font-bold p-2">
                    <span>Dados Contato</span>
                </div>
                <form >
                    <Grid container spacing={2} className="row q-col-gutter-md">
                        {/* Nome */}
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
                            <TextField
                                fullWidth
                                label="Nome"
                                variant="outlined"
                                {...register('name', { required: 'Nome é obrigatório' })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        {/* Número */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Número"
                                variant="outlined"
                                placeholder="+DDI (DDD) 99999 9999"
                                {...register('number', {
                                    required: 'Número é obrigatório',
                                    pattern: {
                                        value: /^\+\d{2} \(\d{2}\) \d{5}-\d{4}$/,
                                        message: 'Número inválido'
                                    }
                                })}
                                error={!!errors.number}
                                helperText="Número do celular deverá conter 9 dígitos e ser precedido do DDI E DDD."
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="E-mail"
                                variant="outlined"
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                        message: 'Email inválido'
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        {/* CPF/CNPJ */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="CPF/CNPJ"
                                variant="outlined"
                                placeholder="CPF/CNPJ"
                                {...register('cpf', { required: 'CPF/CNPJ é obrigatório' })}
                                error={!!errors.cpf}
                                helperText="Número do CPF/CNPJ deverá conter caracteres especiais como traços e barras."
                            />
                        </Grid>

                        {/* Data de Aniversário */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Data de Aniversário"
                                variant="outlined"
                                placeholder="01/01/1990"
                                {...register('birthdayDate', { required: 'Data de Aniversário é obrigatória' })}
                                error={!!errors.birthdayDate}
                                helperText="A data de aniversário deverá ser informada no formato 01/01/1990."
                            />
                        </Grid>

                        {/* Primeiro Nome */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Primeiro Nome"
                                variant="outlined"
                                placeholder="Primeiro Nome"
                                {...register('firstName', { required: 'Primeiro Nome é obrigatório' })}
                                error={!!errors.firstName}
                                helperText="Primeiro nome"
                            />
                        </Grid>

                        {/* Sobrenome */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Sobrenome"
                                variant="outlined"
                                placeholder="Sobrenome"
                                {...register('lastName', { required: 'Sobrenome é obrigatório' })}
                                error={!!errors.lastName}
                                helperText="Sobrenome"
                            />
                        </Grid>

                        {/* Empresa */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Empresa"
                                variant="outlined"
                                placeholder="Empresa"
                                {...register('businessName', { required: 'Empresa é obrigatório' })}
                                error={!!errors.businessName}
                                helperText="Empresa"
                            />
                        </Grid>
                    </Grid>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Enviar
                    </button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary">
                    Cancelar
                </Button>
                <Button color="primary">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>)
}