import { Card, CardContent, Dialog, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
const optionsWhatsappsTypes = [
    { label: 'WhatsApp Oficial (WABA)', value: 'waba' },
    { label: 'WhatsApp Baileys (QRCode)', value: 'baileys' },
    { label: 'WhatsApp WebJs (QRCode)', value: 'whatsapp' },
    { label: 'Telegram', value: 'telegram' },
    // { label: 'Instagram (Beta Version)', value: 'instagram' },
    // { label: 'Messenger (em breve)', value: 'messenger' }
]
export const ModalWhatsapp = () => {
    return (
        <Dialog open={false}>
            <Card sx={{ width: 500 }}>
                <CardContent>
                    <div className="text-lg">CanalA</div>
                </CardContent>

                <CardContent>
                    <div className="col-span-12 my-2">
                        <FormControl fullWidth variant="filled" margin="normal">
                            <InputLabel id="whatsapp-type-label">Tipo</InputLabel>
                            <Select
                                labelId="whatsapp-type-label"
                                id="whatsapp-type"
                                // value={whatsapp.type}
                                // onChange={(e) => setWhatsapp({ ...whatsapp, type: e.target.value })}
                                // disabled={!!whatsapp.id}
                                label="Tipo"
                            >
                                {optionsWhatsappsTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* Optionally, include a FormHelperText component if you have additional helper text */}
                            {/* <FormHelperText>Additional helper text</FormHelperText> */}
                        </FormControl>

                    </div>
                    <div className="col-span-12 my-2">
                        as
                    </div>
                    {/* <div class="col-12 q-my-sm" v-if="whatsapp.type === 'whatsapp' || whatsapp.type === 'baileys' && whatsapp.status !== 'CONNECTED'">
              <q-checkbox v-model="showPairingCode" label="Pairing Code" />
            </div> */}
                </CardContent>
            </Card>
        </Dialog>

    )
}