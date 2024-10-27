from flask_sqlalchemy import SQLAlchemy
from geoalchemy2 import Geometry

db = SQLAlchemy()

class FireReport(db.Model):
    __tablename__ = 'fire_reports'

    id = db.Column(db.Integer, primary_key=True)
    longitude = db.Column(db.Numeric(9, 6), nullable=False)
    latitude = db.Column(db.Numeric(8, 6), nullable=False)
    severity = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.String(15))
    is_cleared = db.Column(db.Boolean, default=False)
    cleared_by = db.Column(db.String(100))
    clear_remarks = db.Column(db.Text)
    updated_remarks = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    location = db.Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
