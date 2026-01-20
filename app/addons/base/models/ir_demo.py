# Part of Odoo. See LICENSE file for full copyright and licensing details.

from app import models
from app.addons.base.models.ir_module import assert_log_admin_access


class IrDemo(models.TransientModel):
    _name = 'ir.demo'
    _description = 'Demo'

    @assert_log_admin_access
    def install_demo(self):
        import app.modules.loading  # noqa: PLC0415
        app.modules.loading.force_demo(self.env)
        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': '/app',
        }
