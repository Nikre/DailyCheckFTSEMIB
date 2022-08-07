from flask.cli import FlaskGroup
from project import app
import func.database as db
import signal

cli = FlaskGroup(app)
signal.signal(signal.SIGINT, db.close_db) # Gestione del CTRL-C

if __name__ == "__main__":
    # Build the main db, quello dello storico
    db.build_stocks_db()
    cli()