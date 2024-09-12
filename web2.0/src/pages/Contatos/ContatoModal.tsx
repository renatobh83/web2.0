import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
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
                        <Grid sx={{ flexGrow: 1, width: '100%' }}>
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
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
                        <Grid sx={{ flexGrow: 1, width: { xs: '100%', md: '33.33%' } }}>
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
                    <DialogActions>
                        <Button
                            color="primary">
                            Cancelar
                        </Button>
                        <Button color="primary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

        </Dialog>)
}